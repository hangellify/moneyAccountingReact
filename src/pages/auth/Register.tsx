import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  registerSchema,
  type RegisterFormData,
} from '@/lib/validation-schemas';
import { Loader2 } from 'lucide-react';
import type { RegisterRequest } from '@/types/auth';

export function Register(): React.ReactElement {
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      username: '',
    },
  });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const payload: RegisterRequest = {
        email: data.email,
        password: data.password,
        first_name: data.first_name.trim(),
      };
      if (data.last_name?.trim()) payload.last_name = data.last_name.trim();
      if (data.username?.trim()) payload.username = data.username.trim();

      await registerUser(payload);
      toast({
        variant: 'success',
        title: t('register.successTitle'),
        description: t('register.successDescription'),
      });
      void navigate('/dashboard', { replace: true });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('register.failureTitle'),
        description:
          error instanceof Error ? error.message : t('register.failureTitle'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mx-auto max-w-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {t('register.title')}
            </h1>
            <p className="text-muted-foreground">{t('register.description')}</p>
          </div>
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border bg-card p-4 sm:p-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.fields.email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('login.fields.emailPlaceholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.fields.password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('login.fields.passwordPlaceholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('register.fields.passwordHint')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('register.fields.firstName')}{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('register.fields.firstNamePlaceholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.fields.lastName')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('register.fields.lastNamePlaceholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.fields.username')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('register.fields.usernamePlaceholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('register.submitting')}
                </>
              ) : (
                t('register.submit')
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
