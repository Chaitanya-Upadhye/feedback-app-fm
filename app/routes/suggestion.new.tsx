import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/Select";
import { getSupabase, requireUserSession } from "~/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);

  const supabase = getSupabase({ request });
  const { data } = await supabase.from("category").select("*");

  return json({
    categories: data,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await requireUserSession(request);
  const supabase = getSupabase({ request });
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const { error } = await supabase.from("feedback").insert({
    category_id: +values?.category,
    content: values?.feedbackDetail,
    user_id: session.user.id,
    status_id: 1,
    title: values?.title,
  });
  // if (!error) throw redirect("/suggestions");
  return { error };
}

function AddSuggestion() {
  const fetcher = useFetcher();
  const { categories = [] } = useLoaderData();
  const form = useRef(null);

  return (
    <Form ref={form} action="/suggestion/new" method="POST">
      <div className="p-10 bg-white mx-auto max-w-[540px] relative mt-32 rounded-app">
        <div className="oval">
          <span className="oval-icon">+</span>
        </div>
        <h1 className="pt-2 mb-10 text-heading-h1 text-navyText">
          Create New Feedback
        </h1>
        <Input
          name="title"
          className="mb-6"
          label="Feedback Title"
          helperText="Add a short, descriptive headline"
        />
        <label className={`block text-navyText text-heading-h4 mb-[2px]`}>
          {"Category"}
        </label>
        <span className="text-body-md text-mediumGray inline-block mb-4">
          {"Choose a category for your feedback"}
        </span>
        <Select
          name="category"
          defaultValue={categories?.at(0)?.id?.toString()}
          className=" active:border-mainBlue active:ring-1 active:ring-mainBlue"
        >
          <SelectTrigger className="w-full outline-none focus:outline-none  mb-6">
            <SelectValue className="focus:outline-none text-heading-l" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map(({ title, id }) => {
              return (
                <SelectItem key={id} value={id?.toString()}>
                  {title}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>{" "}
        <Input
          required
          className="mb-6"
          name="feedbackDetail"
          label="Feedback Detail"
          helperText="Include any specific comments on what should be improved, added, etc."
          type="text-area"
        />
        <div className="flex gap-4 ml-auto w-fit">
          <Button variant={"secondary"} className="" size={"sm"}>
            <span className="text-heading-h4">Cancel</span>
          </Button>
          <Button type="submit" className="" size={"sm"}>
            <span className="text-heading-h4">Add Feedback</span>
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default AddSuggestion;
