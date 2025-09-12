import { supabase } from '../lib/supabase';

class TimetableService {
  async getTimetableByClass(classId, academicYear = '2024-25') {
    try {
      const { data, error } = await supabase?.from('timetable_entries')?.select(`
          *,
          subjects!inner (name, code, credits),
          user_profiles!faculty_id (full_name, email, employee_id),
          classrooms!inner (name, number, type, location),
          time_slots!inner (day_of_week, start_time, end_time)
        `)?.eq('class_id', classId)?.eq('academic_year', academicYear)?.eq('is_active', true)?.order('time_slots(day_of_week)', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching class timetable:', error);
      throw new Error('Failed to load class timetable');
    }
  }

  async getFacultySchedule(facultyId, academicYear = '2024-25') {
    try {
      const { data, error } = await supabase?.from('timetable_entries')?.select(`
          *,
          subjects!inner (name, code, credits),
          classes!inner (name, code, section, semester_level),
          classrooms!inner (name, number, type, location),
          time_slots!inner (day_of_week, start_time, end_time)
        `)?.eq('faculty_id', facultyId)?.eq('academic_year', academicYear)?.eq('is_active', true)?.order('time_slots(day_of_week)', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching faculty schedule:', error);
      throw new Error('Failed to load faculty schedule');
    }
  }

  async getStudentTimetable(studentId, academicYear = '2024-25') {
    try {
      // First get student's classes
      const { data: studentClasses, error: classError } = await supabase?.from('student_classes')?.select('class_id')?.eq('student_id', studentId)?.eq('is_active', true);

      if (classError) throw classError;

      if (!studentClasses?.length) {
        return [];
      }

      const classIds = studentClasses?.map(sc => sc?.class_id);

      const { data, error } = await supabase?.from('timetable_entries')?.select(`
          *,
          subjects!inner (name, code, credits),
          user_profiles!faculty_id (full_name, email),
          classrooms!inner (name, number, type, location),
          time_slots!inner (day_of_week, start_time, end_time),
          classes!inner (name, code, section)
        `)?.in('class_id', classIds)?.eq('academic_year', academicYear)?.eq('is_active', true)?.order('time_slots(day_of_week)', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching student timetable:', error);
      throw new Error('Failed to load student timetable');
    }
  }

  async checkConflicts(entry) {
    try {
      const { data, error } = await supabase?.rpc('check_timetable_conflicts', {
        p_subject_id: entry?.subject_id,
        p_faculty_id: entry?.faculty_id,
        p_class_id: entry?.class_id,
        p_classroom_id: entry?.classroom_id,
        p_time_slot_id: entry?.time_slot_id,
        p_academic_year: entry?.academic_year || '2024-25',
        p_exclude_entry_id: entry?.id || null
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error checking conflicts:', error);
      throw new Error('Failed to check schedule conflicts');
    }
  }

  async createTimetableEntry(entry) {
    try {
      // First check for conflicts
      const conflicts = await this.checkConflicts(entry);
      if (conflicts?.length > 0) {
        return { 
          error: { 
            message: conflicts?.map(c => c?.conflict_message)?.join(', '),
            conflicts 
          } 
        };
      }

      const { data, error } = await supabase?.from('timetable_entries')?.insert([{
          subject_id: entry?.subject_id,
          faculty_id: entry?.faculty_id,
          class_id: entry?.class_id,
          classroom_id: entry?.classroom_id,
          time_slot_id: entry?.time_slot_id,
          academic_year: entry?.academic_year || '2024-25',
          effective_from: entry?.effective_from || new Date()?.toISOString()?.split('T')?.[0]
        }])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating timetable entry:', error);
      return { 
        data: null, 
        error: { message: 'Failed to create timetable entry' } 
      };
    }
  }

  async updateTimetableEntry(id, updates) {
    try {
      // Check conflicts if relevant fields are being updated
      if (updates?.subject_id || updates?.faculty_id || updates?.class_id || 
          updates?.classroom_id || updates?.time_slot_id) {
        
        // Get current entry to use for conflict check
        const { data: currentEntry } = await supabase?.from('timetable_entries')?.select('*')?.eq('id', id)?.single();

        if (currentEntry) {
          const entryToCheck = { ...currentEntry, ...updates, id };
          const conflicts = await this.checkConflicts(entryToCheck);
          
          if (conflicts?.length > 0) {
            return { 
              error: { 
                message: conflicts?.map(c => c?.conflict_message)?.join(', '),
                conflicts 
              } 
            };
          }
        }
      }

      const { data, error } = await supabase?.from('timetable_entries')?.update(updates)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating timetable entry:', error);
      return { 
        data: null, 
        error: { message: 'Failed to update timetable entry' } 
      };
    }
  }

  async deleteTimetableEntry(id) {
    try {
      const { error } = await supabase?.from('timetable_entries')?.delete()?.eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting timetable entry:', error);
      return { error: { message: 'Failed to delete timetable entry' } };
    }
  }

  async generateAutoTimetable(classId, academicYear = '2024-25') {
    try {
      // This is a basic auto-generation algorithm
      // Get available subjects for the class
      const { data: classInfo, error: classError } = await supabase?.from('classes')?.select('*, departments!inner(id)')?.eq('id', classId)?.single();

      if (classError) throw classError;

      // Get subjects for this department and semester level
      const { data: subjects, error: subjectsError } = await supabase?.from('subjects')?.select('*')?.eq('department_id', classInfo?.departments?.id);

      if (subjectsError) throw subjectsError;

      // Get available faculty for these subjects
      const { data: facultySubjects, error: facultyError } = await supabase?.from('faculty_subjects')?.select(`
          *,
          subjects!inner(*),
          user_profiles!faculty_id(*)
        `)?.in('subject_id', subjects?.map(s => s?.id) || []);

      if (facultyError) throw facultyError;

      // Get available time slots
      const { data: timeSlots, error: timeSlotsError } = await supabase?.from('time_slots')?.select('*')?.eq('is_active', true)?.order('day_of_week', { ascending: true })?.order('start_time', { ascending: true });

      if (timeSlotsError) throw timeSlotsError;

      // Get available classrooms
      const { data: classrooms, error: classroomsError } = await supabase?.from('classrooms')?.select('*')?.eq('is_active', true);

      if (classroomsError) throw classroomsError;

      // Simple algorithm: assign each subject to available slots
      const generatedEntries = [];
      const usedSlots = new Set();

      for (const fs of facultySubjects || []) {
        for (let i = 0; i < (fs?.subjects?.credits || 1); i++) {
          // Find an available time slot
          const availableSlot = timeSlots?.find(ts => 
            !usedSlots?.has(ts?.id) && 
            classrooms?.some(cr => cr?.type === 'lecture' || cr?.type === fs?.subjects?.type)
          );

          if (availableSlot && classrooms?.length > 0) {
            const suitableClassroom = classrooms?.find(cr => 
              cr?.type === 'lecture' || cr?.type === fs?.subjects?.type
            );

            if (suitableClassroom) {
              // Check for conflicts
              const conflicts = await this.checkConflicts({
                subject_id: fs?.subject_id,
                faculty_id: fs?.faculty_id,
                class_id: classId,
                classroom_id: suitableClassroom?.id,
                time_slot_id: availableSlot?.id,
                academic_year: academicYear
              });

              if (conflicts?.length === 0) {
                generatedEntries?.push({
                  subject_id: fs?.subject_id,
                  faculty_id: fs?.faculty_id,
                  class_id: classId,
                  classroom_id: suitableClassroom?.id,
                  time_slot_id: availableSlot?.id,
                  academic_year: academicYear
                });
                usedSlots?.add(availableSlot?.id);
              }
            }
          }
        }
      }

      return { data: generatedEntries, error: null };
    } catch (error) {
      console.error('Error generating auto timetable:', error);
      return { 
        data: null, 
        error: { message: 'Failed to generate automatic timetable' } 
      };
    }
  }

  async getTimeSlots() {
    try {
      const { data, error } = await supabase?.from('time_slots')?.select('*')?.eq('is_active', true)?.order('day_of_week')?.order('start_time');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw new Error('Failed to load time slots');
    }
  }

  async getClassrooms() {
    try {
      const { data, error } = await supabase?.from('classrooms')?.select('*')?.eq('is_active', true)?.order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      throw new Error('Failed to load classrooms');
    }
  }

  async getSubjects() {
    try {
      const { data, error } = await supabase?.from('subjects')?.select('*, departments(name)')?.order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw new Error('Failed to load subjects');
    }
  }

  async getClasses() {
    try {
      const { data, error } = await supabase?.from('classes')?.select('*, departments(name)')?.order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw new Error('Failed to load classes');
    }
  }

  async getFaculty() {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('role', 'faculty')?.eq('is_active', true)?.order('full_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching faculty:', error);
      throw new Error('Failed to load faculty');
    }
  }
}

export const timetableService = new TimetableService();