import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Store, Mail, Lock, User, Phone, MapPin, Building2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const MerchantAuth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const navigate = useNavigate();

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State  
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactName, setContactName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const getPasswordValidation = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const passwordValidation = getPasswordValidation(signUpPassword);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = signUpPassword === confirmPassword && confirmPassword.length > 0;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting to sign in with email:', signInEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data);

      // Check if user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, name, email')
        .eq('id', data.user.id)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user role:', userError);
        toast.error('Error verifying merchant access');
        return;
      }

      // If user doesn't exist in users table, create them
      if (!userData) {
        console.log('User not found in users table, creating user record...');
        
        const userRole = data.user.user_metadata?.role || 'customer';
        
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.user_metadata?.contactName,
            role: userRole,
            avatar_url: data.user.user_metadata?.avatar_url
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user record:', createError);
          toast.error('Error creating user profile');
          return;
        }

        console.log('Created user record:', newUser);
        
        // Check if the created user is a merchant
        if (newUser.role !== 'merchant') {
          toast.error('This account is not registered as a merchant');
          await supabase.auth.signOut();
          return;
        }
      } else {
        // Check if existing user has merchant role
        if (userData.role !== 'merchant') {
          toast.error('This account is not registered as a merchant');
          await supabase.auth.signOut();
          return;
        }
      }

      toast.success('Welcome back!');
      // Navigation will happen automatically via useAuth
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }
    
    if (!doPasswordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      console.log('Creating merchant account with data:', {
        email: signUpEmail,
        contactName,
        businessName,
        phone,
        address,
        role: 'merchant'
      });

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', signUpEmail)
        .single();

      if (existingUser) {
        toast.error('An account with this email already exists. Please sign in instead.');
        setActiveTab('signin');
        setSignInEmail(signUpEmail);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/merchant`,
          data: {
            name: contactName,
            contactName: contactName,
            business_name: businessName,
            phone: phone,
            address: address,
            role: 'merchant',
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Merchant signup successful:', data);
      
      if (data.user && !data.session) {
        toast.success('Please check your email to verify your account before signing in.');
        setActiveTab('signin');
        setSignInEmail(signUpEmail);
      } else {
        toast.success('Merchant account created successfully!');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email already exists. Please sign in instead.');
        setActiveTab('signin');
        setSignInEmail(signUpEmail);
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Merchant Portal</h1>
          <p className="text-gray-600">Manage your store and grow your business</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your merchant account
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardTitle>Create Merchant Account</CardTitle>
                <CardDescription>
                  Join our platform and start selling
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="merchant@example.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type={showSignInPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Contact Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="contact-name"
                          type="text"
                          placeholder="John Doe"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="business-name">Business Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="business-name"
                          type="text"
                          placeholder="My Store"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Business Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="business@example.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showSignUpPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Password Requirements */}
                    {signUpPassword.length > 0 && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            {passwordValidation.minLength ? (
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={passwordValidation.minLength ? 'text-green-700' : 'text-red-700'}>
                              At least 8 characters
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            {passwordValidation.hasUppercase ? (
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={passwordValidation.hasUppercase ? 'text-green-700' : 'text-red-700'}>
                              One uppercase letter
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            {passwordValidation.hasLowercase ? (
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={passwordValidation.hasLowercase ? 'text-green-700' : 'text-red-700'}>
                              One lowercase letter
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            {passwordValidation.hasNumber ? (
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={passwordValidation.hasNumber ? 'text-green-700' : 'text-red-700'}>
                              One number
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            {passwordValidation.hasSpecial ? (
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={passwordValidation.hasSpecial ? 'text-green-700' : 'text-red-700'}>
                              One special character
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {confirmPassword.length > 0 && (
                      <div className="flex items-center text-xs mt-1">
                        {doPasswordsMatch ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-700">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-red-500 mr-1" />
                            <span className="text-red-700">Passwords do not match</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="address"
                        type="text"
                        placeholder="123 Main St, City, State"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !isPasswordValid || !doPasswordsMatch}
                  >
                    {loading ? 'Creating Account...' : 'Create Merchant Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Looking to shop instead?{' '}
            <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">
              Visit Consumer Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MerchantAuth;