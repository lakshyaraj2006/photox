import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { LogInIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import useMultistepForm from '@/hooks/useMultistepForm';
import { cn } from '@/lib/utils';

// No changes to the schema
const signupSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name cannot be empty!" }),
  username: z
    .string()
    .nonempty({ message: "Username cannot be empty!" })
    .min(6, { message: "Username must contain atleast 6 characters" })
    .max(16, { message: "Username can contain atmost 16 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .nonempty({ message: "Password cannot be empty!" })
    .min(8, { message: "Password must contain atleast 8 characters!" }),
  cpassword: z
    .string()
    .nonempty({ message: "Confirm password cannot be empty!" })
})
  .refine(data => data.password === data.cpassword, {
    message: "Passwords do not match!",
    path: ["cpassword"]
  });

const stepsFields: (keyof z.infer<typeof signupSchema>)[][] = [
  ['name', 'username', 'email'],
  ['password', 'cpassword']
];

export default function Signup() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      cpassword: "",
    }
  });

  const { step, isFirstStep, isLastStep, next, back, currentStepIndex } = useMultistepForm([
    <div key="step1" className='space-y-6'>
      <FormField
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder='Enter your full name' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='username'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder='Enter unique username' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input placeholder='Enter your email address' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>,
    <div key="step2" className='space-y-6'>
      <FormField
        control={form.control}
        name='password'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type='password' placeholder='Choose your password' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='cpassword'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input type='password' placeholder='Confirm your password' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  ]);

  const { trigger } = form;

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    console.log("Form submitted successfully!");
    console.log(data);
  }

  const handleNext = async () => {
    const isStepValid = await trigger(stepsFields[currentStepIndex]);

    if (isStepValid) {
      next();
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-200'>
      <Card className='w-full max-w-md'> {/* Corrected width for better responsiveness */}
        <CardHeader>
          <CardTitle className='text-center text-xl'>Signup For New Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {step}

              <div className="flex gap-4">
                {!isFirstStep && (
                  <Button type='button' onClick={back} className='flex-1' variant="outline">
                    &larr; Back
                  </Button>
                )}

                <Button
                  type={isLastStep ? 'submit' : 'button'}
                  onClick={!isLastStep ? handleNext : undefined}
                  className='flex-1' // Changed from w-full to flex-1
                >
                  {isLastStep ? (
                    <>
                      <LogInIcon className="mr-2 h-4 w-4" /> Sign up
                    </>
                  ) : (
                    <>Next &rarr;</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='justify-center'>
          <p>Already have an account? <Link to="/auth/login" className='text-blue-500 hover:underline'>Login here</Link></p>
        </CardFooter>
      </Card>
    </div>
  )
}