import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signupUser } from "@/store/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";
import Error from "@/components/ui/Error";
import { useEffect } from "react";
const Signup = () => {
  const { loading, error, success, userInfo } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const signupSchema = z.object({
    email: z
      .string()
      .email("This is not a valid email")
      .min(1, { message: "This field has to be filled." }),
    password: z.string().min(4),
    username: z.string().min(4),
  });
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });
  useEffect(() => {
    // redirect user to login page if registration was successful
    if (success) navigate("/login");
    // redirect authenticated user to profile screen
    // if (userInfo) navigate("/user-profile");
  }, [navigate, userInfo, success]);
  function onSubmit(values: z.infer<typeof signupSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    values.email = values.email.toLowerCase();

    dispatch(signupUser(values));

    console.log(values);
  }

  return (
    <div className="flex justify-center h-screen items-center ">
      {" "}
      <Card className="w-full max-w-md">
        <CardTitle className="text-center py-10">Signup</CardTitle>

        <CardContent className="flex flex-col items-center justify-center p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
            >
              {error && <Error>{error}</Error>}

              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
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
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loading ? <Spinner /> : <Button type="submit">Submit</Button>}
              </div>
            </form>
          </Form>
          <CardFooter className="text-center mt-4">
            <p className="">Already have an account?</p>
            <Link to="/login" className="text-gray-500 hover:underline">
              Login here
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
