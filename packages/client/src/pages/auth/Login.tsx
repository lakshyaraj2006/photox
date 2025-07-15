import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogInIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  identifier: z
    .string()
    .nonempty({ error: "Indentifier cannot be empty!" }),
  password: z
    .string()
    .nonempty({ error: "Password cannot be empty!" })
});

export default function Login() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log(data);
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
                      <Input placeholder='Enter your username' {...field} />
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
