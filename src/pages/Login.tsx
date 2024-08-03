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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, resetState } from "@/store/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Login = () => {
  const { loading, error, success, userInfo } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const loginSchema = z.object({
    email: z
      .string()
      .email("This is not a valid email")
      .min(1, { message: "This field has to be filled." }),
    password: z.string().min(4),
  });
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  useEffect(() => {
    // redirect user to login page if registration was successful
    if (success) navigate("/chat");
    console.log(success);
    // redirect authenticated user to profile screen
    dispatch(resetState());
  }, [navigate, userInfo, success]);
  function onSubmit(values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);

    dispatch(loginUser(values));
  }
  return (
    <div className="flex justify-center h-screen items-center ">
      {" "}
      <Card className="w-full max-w-md">
        <CardTitle className="text-center py-10">Login</CardTitle>

        <CardContent className="flex flex-col items-center justify-center p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
            >
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
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
          <CardFooter className="text-center mt-4">
            <p className="">Dont have an account?</p>
            <Link to="/signup" className="text-gray-500 hover:underline">
              Register here
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
