import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { loginSchema, type LoginFormData } from '@/lib/validation-schemas';
import { Loader2 } from 'lucide-react';

export function Login(): React.ReactElement {
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await login({ email: data.email, password: data.password });
      toast({
        variant: 'success',
        title: t('login.successTitle'),
        description: t('login.successDescription'),
      });
      const from =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? '/dashboard';
      void navigate(from, { replace: true });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('login.failureTitle'),
        description:
          error instanceof Error ? error.message : t('login.failureTitle'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mx-auto max-w-md">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {t('login.title')}
            </h1>
            <p className="text-muted-foreground">{t('login.description')}</p>
          </div>
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 rounded-lg border bg-card p-4 sm:p-6"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('login.submitting')}
                </>
              ) : (
                t('login.submit')
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
