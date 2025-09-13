-- Schema Analysis: Fresh project - No existing tables
-- Integration Type: Complete new schema creation
-- Dependencies: auth.users (Supabase built-in)

-- Step 1: Create custom types (enums)
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'faculty', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.day_of_week AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.semester AS ENUM ('Fall', 'Spring', 'Summer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.time_slot_status AS ENUM ('available', 'occupied', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create tables (auth dependencies first)

-- User profiles table (extends auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role public.user_role NOT NULL DEFAULT 'student',
    employee_id TEXT UNIQUE,
    department TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments table
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    head_id UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 3,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    semester public.semester NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms/Classrooms table
CREATE TABLE public.classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    number TEXT NOT NULL UNIQUE,
    capacity INTEGER NOT NULL DEFAULT 50,
    type TEXT NOT NULL DEFAULT 'lecture',
    location TEXT,
    has_projector BOOLEAN DEFAULT FALSE,
    has_whiteboard BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time slots table
CREATE TABLE public.time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week public.day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure end time is after start time
    CONSTRAINT check_time_order CHECK (end_time > start_time)
);

-- Faculty-Subject assignments (many-to-many)
CREATE TABLE public.faculty_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(faculty_id, subject_id)
);

-- Classes/Batches table
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    semester_level INTEGER NOT NULL CHECK (semester_level >= 1 AND semester_level <= 8),
    section TEXT NOT NULL DEFAULT 'A',
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(code, section, academic_year)
);

-- Student-Class assignments (many-to-many)
CREATE TABLE public.student_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    UNIQUE(student_id, class_id)
);

-- Main timetable entries
CREATE TABLE public.timetable_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    time_slot_id UUID NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent double booking constraints
    UNIQUE(classroom_id, time_slot_id, academic_year, effective_from),
    UNIQUE(faculty_id, time_slot_id, academic_year, effective_from),
    UNIQUE(class_id, time_slot_id, academic_year, effective_from)
);

-- Faculty unavailability (for leave, meetings, etc.)
CREATE TABLE public.faculty_unavailability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    time_slot_id UUID NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
    reason TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(faculty_id, time_slot_id, start_date)
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create indexes for performance
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_department ON public.user_profiles(department);
CREATE INDEX idx_user_profiles_active ON public.user_profiles(is_active);
CREATE INDEX idx_subjects_department ON public.subjects(department_id);
CREATE INDEX idx_subjects_semester ON public.subjects(semester);
CREATE INDEX idx_timetable_entries_class ON public.timetable_entries(class_id);
CREATE INDEX idx_timetable_entries_faculty ON public.timetable_entries(faculty_id);
CREATE INDEX idx_timetable_entries_subject ON public.timetable_entries(subject_id);
CREATE INDEX idx_timetable_entries_classroom ON public.timetable_entries(classroom_id);
CREATE INDEX idx_timetable_entries_time_slot ON public.timetable_entries(time_slot_id);
CREATE INDEX idx_timetable_entries_academic_year ON public.timetable_entries(academic_year);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_faculty_unavailability_faculty ON public.faculty_unavailability(faculty_id);
CREATE INDEX idx_faculty_unavailability_dates ON public.faculty_unavailability(start_date, end_date);

-- Step 4: Create functions for automatic updates
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON public.departments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_classrooms_updated_at
    BEFORE UPDATE ON public.classrooms
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON public.classes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_timetable_entries_updated_at
    BEFORE UPDATE ON public.timetable_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Step 6: Create function for timetable conflict detection
CREATE OR REPLACE FUNCTION public.check_timetable_conflicts(
    p_subject_id UUID,
    p_faculty_id UUID,
    p_class_id UUID,
    p_classroom_id UUID,
    p_time_slot_id UUID,
    p_academic_year TEXT,
    p_effective_from DATE DEFAULT CURRENT_DATE,
    p_exclude_entry_id UUID DEFAULT NULL
)
RETURNS TABLE (
    conflict_type TEXT,
    conflict_message TEXT
) AS $$
BEGIN
    -- Check classroom conflict
    IF EXISTS (
        SELECT 1 FROM public.timetable_entries te
        WHERE te.classroom_id = p_classroom_id 
        AND te.time_slot_id = p_time_slot_id 
        AND te.academic_year = p_academic_year
        AND te.effective_from <= p_effective_from
        AND (te.effective_to IS NULL OR te.effective_to >= p_effective_from)
        AND te.is_active = TRUE
        AND (p_exclude_entry_id IS NULL OR te.id != p_exclude_entry_id)
    ) THEN
        RETURN QUERY SELECT 'classroom'::TEXT, 'Classroom is already occupied at this time'::TEXT;
    END IF;

    -- Check faculty conflict
    IF EXISTS (
        SELECT 1 FROM public.timetable_entries te
        WHERE te.faculty_id = p_faculty_id 
        AND te.time_slot_id = p_time_slot_id 
        AND te.academic_year = p_academic_year
        AND te.effective_from <= p_effective_from
        AND (te.effective_to IS NULL OR te.effective_to >= p_effective_from)
        AND te.is_active = TRUE
        AND (p_exclude_entry_id IS NULL OR te.id != p_exclude_entry_id)
    ) THEN
        RETURN QUERY SELECT 'faculty'::TEXT, 'Faculty is already assigned at this time'::TEXT;
    END IF;

    -- Check class conflict
    IF EXISTS (
        SELECT 1 FROM public.timetable_entries te
        WHERE te.class_id = p_class_id 
        AND te.time_slot_id = p_time_slot_id 
        AND te.academic_year = p_academic_year
        AND te.effective_from <= p_effective_from
        AND (te.effective_to IS NULL OR te.effective_to >= p_effective_from)
        AND te.is_active = TRUE
        AND (p_exclude_entry_id IS NULL OR te.id != p_exclude_entry_id)
    ) THEN
        RETURN QUERY SELECT 'class'::TEXT, 'Class already has a subject at this time'::TEXT;
    END IF;

    -- Check faculty unavailability
    IF EXISTS (
        SELECT 1 FROM public.faculty_unavailability fu
        WHERE fu.faculty_id = p_faculty_id 
        AND fu.time_slot_id = p_time_slot_id 
        AND fu.start_date <= p_effective_from
        AND (fu.end_date IS NULL OR fu.end_date >= p_effective_from)
    ) THEN
        RETURN QUERY SELECT 'unavailable'::TEXT, 'Faculty is not available at this time'::TEXT;
    END IF;

    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name, 
    role
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- Step 8: Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 9: Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 10: Create RLS policies (using correct patterns to avoid circular dependencies)

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 6A: Role-based access using auth.users metadata
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

CREATE OR REPLACE FUNCTION public.is_faculty_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'faculty' 
         OR au.raw_app_meta_data->>'role' = 'faculty'
         OR au.raw_user_meta_data->>'role' = 'admin'
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Admin and Faculty can manage departments
CREATE POLICY "admin_faculty_manage_departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.is_faculty_from_auth())
WITH CHECK (public.is_faculty_from_auth());

-- Read access for authenticated users, admin/faculty can write
CREATE POLICY "authenticated_read_subjects"
ON public.subjects
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_faculty_manage_subjects"
ON public.subjects
FOR INSERT
TO authenticated
WITH CHECK (public.is_faculty_from_auth());

CREATE POLICY "admin_faculty_update_subjects"
ON public.subjects
FOR UPDATE
TO authenticated
USING (public.is_faculty_from_auth())
WITH CHECK (public.is_faculty_from_auth());

CREATE POLICY "admin_delete_subjects"
ON public.subjects
FOR DELETE
TO authenticated
USING (public.is_admin_from_auth());

-- Similar pattern for classrooms
CREATE POLICY "authenticated_read_classrooms"
ON public.classrooms
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_classrooms"
ON public.classrooms
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Time slots accessible to all authenticated users, admin can manage
CREATE POLICY "authenticated_read_time_slots"
ON public.time_slots
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_time_slots"
ON public.time_slots
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Faculty-subject assignments - faculty can manage their own
CREATE POLICY "faculty_manage_own_subject_assignments"
ON public.faculty_subjects
FOR ALL
TO authenticated
USING (faculty_id = auth.uid())
WITH CHECK (faculty_id = auth.uid());

CREATE POLICY "admin_manage_faculty_subjects"
ON public.faculty_subjects
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Classes - admin can manage, others can read
CREATE POLICY "authenticated_read_classes"
ON public.classes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_classes"
ON public.classes
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Student-class assignments - students can see their own
CREATE POLICY "students_view_own_classes"
ON public.student_classes
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "admin_manage_student_classes"
ON public.student_classes
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Timetable entries - role-based access
CREATE POLICY "authenticated_read_timetable"
ON public.timetable_entries
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_faculty_manage_timetable"
ON public.timetable_entries
FOR ALL
TO authenticated
USING (public.is_faculty_from_auth())
WITH CHECK (public.is_faculty_from_auth());

-- Faculty unavailability - faculty can manage their own
CREATE POLICY "faculty_manage_own_unavailability"
ON public.faculty_unavailability
FOR ALL
TO authenticated
USING (faculty_id = auth.uid())
WITH CHECK (faculty_id = auth.uid());

CREATE POLICY "admin_manage_all_unavailability"
ON public.faculty_unavailability
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 2: Simple user ownership for notifications
CREATE POLICY "users_manage_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Step 11: Create mock data with proper auth users
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    faculty_uuid UUID := gen_random_uuid();
    student_uuid UUID := gen_random_uuid();
    dept_cs UUID := gen_random_uuid();
    dept_ee UUID := gen_random_uuid();
    subject1_uuid UUID := gen_random_uuid();
    subject2_uuid UUID := gen_random_uuid();
    classroom1_uuid UUID := gen_random_uuid();
    classroom2_uuid UUID := gen_random_uuid();
    timeslot1_uuid UUID := gen_random_uuid();
    timeslot2_uuid UUID := gen_random_uuid();
    class1_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@schedulo.edu', crypt('Admin@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Sarah Johnson", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (faculty_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'faculty@schedulo.edu', crypt('Faculty@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Prof. Michael Chen", "role": "faculty"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student@schedulo.edu', crypt('Student@123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alex Kumar", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);
    
    -- Create departments
    INSERT INTO public.departments (id, name, code, head_id) VALUES
        (dept_cs, 'Computer Science', 'CS', admin_uuid),
        (dept_ee, 'Electrical Engineering', 'EE', faculty_uuid);
    
    -- Create subjects
    INSERT INTO public.subjects (id, name, code, credits, department_id, semester) VALUES
        (subject1_uuid, 'Database Systems', 'CS301', 4, dept_cs, 'Fall'),
        (subject2_uuid, 'Circuit Analysis', 'EE201', 3, dept_ee, 'Spring');
    
    -- Create classrooms
    INSERT INTO public.classrooms (id, name, number, capacity, type, location, has_projector) VALUES
        (classroom1_uuid, 'Computer Lab 1', 'CL101', 30, 'lab', 'CS Building Floor 1', true),
        (classroom2_uuid, 'Lecture Hall A', 'LH201', 100, 'lecture', 'Main Building Floor 2', true);
    
    -- Create time slots
    INSERT INTO public.time_slots (id, day_of_week, start_time, end_time) VALUES
        (timeslot1_uuid, 'Monday', '09:00:00', '10:30:00'),
        (timeslot2_uuid, 'Tuesday', '11:00:00', '12:30:00');
    
    -- Create classes
    INSERT INTO public.classes (id, name, code, semester_level, section, department_id, academic_year, student_count) VALUES
        (class1_uuid, 'CS Third Year', 'CS3A', 3, 'A', dept_cs, '2024-25', 25);
    
    -- Create faculty-subject assignments
    INSERT INTO public.faculty_subjects (faculty_id, subject_id, is_primary) VALUES
        (faculty_uuid, subject1_uuid, true);
    
    -- Create timetable entries
    INSERT INTO public.timetable_entries (
        subject_id, faculty_id, class_id, classroom_id, time_slot_id, academic_year
    ) VALUES
        (subject1_uuid, faculty_uuid, class1_uuid, classroom1_uuid, timeslot1_uuid, '2024-25');
    
    -- Create student-class assignments
    INSERT INTO public.student_classes (student_id, class_id) VALUES
        (student_uuid, class1_uuid);
    
    -- Create sample notifications
    INSERT INTO public.notifications (user_id, title, message, type) VALUES
        (student_uuid, 'Timetable Updated', 'Your class schedule has been updated for this week', 'info'),
        (faculty_uuid, 'Room Change', 'Database Systems class moved to Computer Lab 2', 'warning');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;