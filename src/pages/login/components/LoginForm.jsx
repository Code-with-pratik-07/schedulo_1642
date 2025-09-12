import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials display for testing
  const demoCredentials = [
    { email: 'admin@schedulo.edu', password: 'Admin@123', role: 'Administrator' },
    { email: 'faculty@schedulo.edu', password: 'Faculty@123', role: 'Faculty Member' },
    { email: 'student@schedulo.edu', password: 'Student@123', role: 'Student' }
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'faculty', label: 'Faculty Member' },
    { value: 'student', label: 'Student' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await signIn(formData?.email, formData?.password);

      if (error) {
        setErrors({
          general: error?.message || 'Login failed. Please try again.'
        });
        return;
      }

      if (data?.user) {
        // Navigate to appropriate dashboard based on user role
        // The role will be determined by the user_profiles table
        const dashboardRoutes = {
          admin: '/admin-dashboard',
          faculty: '/faculty-dashboard',
          student: '/student-dashboard'
        };
        
        // Navigate to role-specific dashboard or default to student
        const targetRoute = dashboardRoutes?.[formData?.role] || '/student-dashboard';
        navigate(targetRoute);
      }
    } catch (error) {
      setErrors({
        general: 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoCredentialClick = (credential) => {
    setFormData({
      email: credential?.email,
      password: credential?.password,
      role: credential?.role === 'Administrator' ? 'admin' : 
            credential?.role === 'Faculty Member' ? 'faculty' : 'student',
      rememberMe: false
    });
    setErrors({});
  };

  const handleForgotPassword = () => {
    if (!formData?.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }
    
    // Password reset functionality would be implemented here
    alert(`Password reset link would be sent to ${formData?.email}. For demo, use the provided credentials below.`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors?.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <Icon name="AlertCircle" size={20} className="text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{errors?.general}</p>
            </div>
          </div>
        )}

        {/* Role Selection */}
        <Select
          label="Select Role"
          placeholder="Choose your role"
          options={roleOptions}
          value={formData?.role}
          onChange={(value) => handleInputChange('role', value)}
          error={errors?.role}
          required
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your institutional email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* Remember Me Checkbox */}
        <Checkbox
          label="Remember me for 30 days"
          checked={formData?.rememberMe}
          onChange={(e) => handleInputChange('rememberMe', e?.target?.checked)}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="LogIn"
          iconPosition="left"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={handleForgotPassword}
            className="text-sm"
          >
            Forgot your password?
          </Button>
        </div>
      </form>

      {/* Demo Credentials Section */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-3">
          <Icon name="Info" size={16} className="text-blue-600 mr-2" />
          <h4 className="text-sm font-medium text-blue-900">Demo Credentials</h4>
        </div>
        <p className="text-xs text-blue-700 mb-3">
          Click any credential below to auto-fill the form:
        </p>
        <div className="space-y-2">
          {demoCredentials?.map((cred, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleDemoCredentialClick(cred)}
              className="w-full text-left p-2 rounded border border-blue-200 bg-white hover:bg-blue-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-blue-900">{cred?.role}</div>
                  <div className="text-xs text-blue-700">{cred?.email}</div>
                </div>
                <div className="text-xs text-blue-600 font-mono">{cred?.password}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;