import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogInIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  identifier: z
    .string()
    .nonempty({ error: "Indentifier cannot be empty!" }),
  password: z
    .string()
    .nonempty({ error: "Password cannot be empty!" })
});

export default function Login() {
  const navigate = useNavigate();
  const { setAuth, getUserProfile } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await axiosInstance.post('/auth/login', data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const { success, message } = response.data;
      const { accessToken, userId } = response.data.data;

      if (success) {
        setAuth({ accessToken, userId });
        await getUserProfile();
        toast.success(message);
        form.reset();

        setTimeout(() => {
          navigate('/');
        }, 2700);
      }
      else toast.error(message);
    } catch (error) {
      if (error instanceof AxiosError) {
        const { message } = error.response.data;
        toast.error(message);
      }

      toast.error("Some error occurred!");
    }

  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-200'>
      <Card className='max-w-1/3 w-full'>
        <CardHeader>
          <CardTitle className='text-center text-xl'>Login Using Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='identifier'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifier</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your username or email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Enter your password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full'><LogInIcon /> Log in</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p>Don't have an account ? <Link to="/auth/signup" className='text-blue-500'>Signup here</Link></p>
        </CardFooter>
      </Card>
    </div>
  )
}
