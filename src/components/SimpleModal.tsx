import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Mail, User, Building, Phone, MessageSquare, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import KevinSIG from '../assets/KevinSIG.svg';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleModal({ isOpen, onClose }: SimpleModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    business: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile and prevent body scroll when modal is open
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1023);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    if (isOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      // Restore scrolling
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // First, save to database
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([{
          ...formData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Then, call the Edge Function to send email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
          body: { contactData: formData }
        });

        if (emailError) {
          console.warn('Email notification failed:', emailError);
          // Don't fail the whole submission if email fails
        }
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't fail the whole submission if email fails
      }

      setSubmitStatus('success');
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        business: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: '',
      last_name: '',
      business: '',
      email: '',
      phone: '',
      message: ''
    });
    setSubmitStatus('idle');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        height: '100vh', 
        width: '100vw',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // Mobile: No padding, align to top
        padding: isMobile ? '0' : '16px',
        alignItems: isMobile ? 'flex-start' : 'center'
      }}
    >
      {/* Enhanced Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
        style={{ 
          height: '100vh', 
          width: '100vw',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-[850px] max-h-[90vh] overflow-y-auto mx-auto" 
        style={{ 
          // Desktop styles
          maxWidth: isMobile ? '100vw' : '850px',
          width: isMobile ? '100vw' : 'auto',
          height: isMobile ? '100vh' : 'auto',
          maxHeight: isMobile ? '100vh' : '90vh',
          transform: isMobile ? 'translateY(0px)' : 'translateY(-125px)',
          borderRadius: isMobile ? '0px' : '8px',
          margin: isMobile ? '0' : 'auto',
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? '0' : 'auto',
          left: isMobile ? '0' : 'auto'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 lg:p-8 border-b">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Let's Connect
            </h2>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
              I'd love to hear about your project and discuss how we can work together to create exceptional user experiences.
            </p>
            <div className="mt-4" style={{ paddingTop: '12px' }}>
              <img 
                src={KevinSIG} 
                alt="Kevin Laronda Signature" 
                className="h-8 w-auto"
                style={{ 
                  filter: 'brightness(0) saturate(100%) invert(0)',
                  transform: 'rotate(8deg)'
                }}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 min-w-0">
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thank you for reaching out!
              </h3>
              <p className="text-gray-600">
                I'll get back to you within 24 hours to discuss your project.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 min-w-0">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="first_name" className="text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    First Name *
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Last Name *
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              {/* Business */}
              <div>
                <Label htmlFor="business" className="text-gray-900 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Business
                </Label>
                <Input
                  id="business"
                  value={formData.business}
                  onChange={(e) => handleInputChange('business', e.target.value)}
                  className="mt-1"
                  placeholder="Your company or organization"
                />
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="email" className="text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="mt-1"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                  className="mt-1"
                  style={{ minHeight: '90px', height: '90px' }}
                  placeholder="Tell me about your project, goals, and how I can help..."
                />
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Sorry, there was an error submitting your message. Please try again or email me directly at kevin@kevinlaronda.com
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
