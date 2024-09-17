import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { getSupabase, requireUserSession } from "~/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);
  const supabase = getSupabase({ request });
  const { data } = await supabase
    .from("profile")
    .select("*")
    .eq("email", session.user.email || "")
    .single();
  console.log({ data });
  if (data?.first_name && data?.last_name && data?.username)
    throw redirect("/suggestions");
  return json({
    email: data?.email,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const supabase = getSupabase({ request });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id as string;
  if (!userId) throw Error("User email not found");
  const values = Object.fromEntries(formData);
  const { error } = await supabase
    .from("profile")
    .update({
      first_name: values?.firstName as string,
      last_name: values?.lastName as string,
      username: values?.username as string,
    })
    .eq("id", userId);
  return { error };
}

function NewProfile() {
  const fetcher = useFetcher();
  const { email } = useLoaderData<{ email: string }>();
  console.log(email);
  return (
    <Form action="/profile/create" method="POST">
      <div className="p-10 bg-white mx-auto max-w-[540px] relative mt-32 rounded-app">
        <div className="oval">
          <span className="oval-icon">+</span>
        </div>
        <h1 className="pt-2 mb-10 text-heading-h1 text-navyText">
          Create Profile
        </h1>
        <Input
          name="username"
          readOnly
          className="mb-6"
          defaultValue={`${generateUsername(email)}`}
          label="Username"
        />
        <Input required className="mb-6" name="firstName" label="First Name" />
        <Input required className="mb-6" name="lastName" label="Last Name" />

        <div className="flex justify-items-end">
          <Button type="submit" className="ml-auto" size={"sm"}>
            <span className="text-heading-h4">Create</span>
          </Button>
        </div>
      </div>
    </Form>
  );
}
function generateUsername(email: string): string {
  const emailPrefix = email.split("@")[0];
  const specialCharacters = ["!", "@", "#", "$", "%", "^", "&", "*"];
  const randomSpecialChar =
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  const randomNumber = Math.floor(Math.random() * 9901) + 100;
  return `${emailPrefix}${randomSpecialChar}${randomNumber}`;
}
export default NewProfile;
