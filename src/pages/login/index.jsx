import React from 'react';
import { Helmet } from 'react-helmet';
import LoginForm from './components/LoginForm';
import InstitutionalBranding from './components/InstitutionalBranding';
import MockCredentialsInfo from './components/MockCredentialsInfo';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login - Schedulo | Educational Timetable Management</title>
        <meta name="description" content="Secure login to Schedulo educational timetable management system. Access your personalized dashboard for academic scheduling." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="order-2 lg:order-1">
              <InstitutionalBranding />
              
              {/* Features List */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Key Features</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">AI</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Smart Scheduling</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <span className="text-success font-semibold text-sm">✓</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Conflict Resolution</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <span className="text-accent font-semibold text-sm">📱</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Mobile Friendly</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border">
                    <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                      <span className="text-warning font-semibold text-sm">🔔</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Real-time Alerts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>
                  <p className="text-muted-foreground">
                    Access your educational dashboard
                  </p>
                </div>

                <LoginForm />
                
                <MockCredentialsInfo />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <span>© {new Date()?.getFullYear()} Schedulo. All rights reserved.</span>
              <span>•</span>
              <span>Educational Institution Solution</span>
              <span>•</span>
              <span>NEP 2020 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;