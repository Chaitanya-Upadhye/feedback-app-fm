import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  json,
} from "@remix-run/node";
import {
  Await,
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import { ChevronUp } from "lucide-react";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { getSupabase, requireUserSession } from "~/supabase";
import { Database } from "~/types/supabase";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserSession(request);
  const { id } = params;
  const supabase = getSupabase({ request });
  const commentsPromise = new Promise((resolve) => {
    supabase
      .from("comment")
      .select("*,profile(*)")
      .eq("feedback_id", Number(id))
      .then((data) => {
        setTimeout(() => {
          resolve(data);
        }, 2000);
      });
  });

  const { data: suggestion } = await supabase
    .from("feedback")
    .select("*,category(title)")
    .eq("id", Number(id))
    .single();
  return defer({
    suggestion,
    commentsPromise,
  });
}
export async function action({ request }: ActionFunctionArgs) {
  const session = await requireUserSession(request);
  const formData = await request.formData();
  const supabase = getSupabase({ request });
  const values = Object.fromEntries(formData);
  if (request.method === "PUT") {
    const { error, data } = await supabase
      .from("comment")
      .insert({
        content: values?.comment?.toString(),
        user_id: session.user.id,
        reply_to: values?.reply_to?.toString(),
        parent_id: +values?.parent_id,
        feedback_id: +values?.suggestion_id,
      })
      .select();

    return { values: { ...data?.at(0) }, error };
  }
  if (request.method === "POST") {
    const { error, data } = await supabase
      .from("comment")
      .insert({
        content: values?.comment?.toString(),
        user_id: session.user.id,
        feedback_id: +values?.feedback_id,
      })
      .select();
    return { values: { ...data?.at(0) }, error };
  }
}
function SuggestionDetail() {
  const { suggestion, commentsPromise } = useLoaderData<{
    suggestion: Database["public"]["Tables"]["feedback"]["Row"];
    commentsPromise: Promise<Database["public"]["Tables"]["comment"]["Row"][]>;
  }>();
  const nav = useNavigation();
  const fetcher = useFetcher();
  return (
    <div className="p-6 lg:max-w-[730px] mx-auto">
      {" "}
      <article
        key={suggestion.id}
        className="bg-white rounded-app px-8 py-7 flex gap-10 hover:cursor-pointer "
      >
        {/* votes */}
        <div className="rounded-app flex flex-col gap-1 bg-mainBg items-center p-2 basis-[40px] h-fit">
          <ChevronUp className="h-4 w-4" color="#4661e6" />
          <span className="text-body-bold text-navyText">
            {suggestion.upvotes}
          </span>
        </div>
        {/* main-content */}
        <div className="flex flex-col flex-grow gap-1">
          <span className="text-navyText text-heading-h3">
            {suggestion.title}
          </span>{" "}
          <p className="text-body-regular text-mediumGray">
            {suggestion.content}
          </p>{" "}
          <div className="mt-3 text-body-bold text-mainBlue px-4 py-1 w-fit bg-mainBg rounded-app">
            {suggestion?.category.title}
          </div>
        </div>
        {/* comments */}
        <div className="flex justify-center items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16">
            <path
              d="M2.62 16H1.346l.902-.91c.486-.491.79-1.13.872-1.823C1.036 11.887 0 9.89 0 7.794 0 3.928 3.52 0 9.03 0 14.87 0 18 3.615 18 7.455c0 3.866-3.164 7.478-8.97 7.478-1.017 0-2.078-.137-3.025-.388A4.705 4.705 0 012.62 16z"
              fill="#CDD2EE"
              fillRule="nonzero"
            />
          </svg>
          <span className="text-heading-h3 text-navyText">
            {suggestion.comments}
          </span>
        </div>
      </article>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={commentsPromise}>
          {({ data }) => {
            const comments = data
              ?.map((c) => ({
                ...c,
                replies: data?.filter((r) => r.parent_id === c.id),
              }))
              .filter((c) => c.parent_id == null);
            return (
              <>
                {" "}
                <div className="mt-6 rounded-app bg-white px-8 py-6">
                  <Comments comments={comments} suggestion={suggestion} />
                </div>
                <div className="mt-6 rounded-app bg-white p-8 ">
                  <h3 className=" text-heading-h3 text-navyText mb-6">
                    Add Comment
                  </h3>
                  <fetcher.Form method="POST">
                    <input
                      type="hidden"
                      name={"feedback_id"}
                      value={suggestion.id}
                    />
                    <Input
                      disabled={fetcher.state !== "idle"}
                      name="comment"
                      type="text-area"
                    ></Input>
                    <div className="mt-4 flex justify-between">
                      <span>x characters left</span>
                      <Button
                        disabled={fetcher.state !== "idle"}
                        type="submit"
                        variant={"primary"}
                      >
                        {fetcher.state == "idle"
                          ? "Post Comment"
                          : "Submitting..."}
                      </Button>
                    </div>
                  </fetcher.Form>
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
const Comments = ({ comments = [], suggestion = {}, parentId = null }) => {
  const [repliesState, setReplies] = useState<number[]>([]);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  const isSuccessful = fetcher.state === "idle" && fetcher.data?.error === null;
  useEffect(() => {
    if (isSuccessful) setReplies([]);
  }, [isSuccessful]);

  return (
    <>
      {" "}
      {comments.map((comment, idx) => {
        const {
          content,
          profile: { first_name, last_name, username },
          id,
          reply_to = "",
          replies = [],
        } = comment;
        return (
          <div key={id} className="mb-8 " id={id}>
            <div key={id} className="">
              <div className="flex justify-between items-center">
                <div className="flex gap-8">
                  <img
                    src={`https://i.pravatar.cc/150?u=${username}`}
                    alt="user-avatar"
                    className="rounded-full h-10 w-10 rounded-[999px]"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-heading-h4 text-navyText">{`${first_name} ${last_name}`}</span>
                    <span className="text-mediumGray text-body-md">{`@${username}`}</span>
                  </div>
                </div>
                <button onClick={() => setReplies((prev) => [...prev, idx])}>
                  {" "}
                  <span className="text-mainBlue text-heading-h4">Reply</span>
                </button>
              </div>
              <div className="relative">
                {/* Line */}
                {replies.length ? (
                  <div className=" w-[2px] bg-mainBg absolute h-full left-[22px] top-[23px]"></div>
                ) : null}
                <p className="text-mediumGray text-body-md py-4 pl-[72px] relative">
                  {!replies?.length && reply_to ? (
                    <span className="text-body-bold text-mainPink">{`@${reply_to} `}</span>
                  ) : null}
                  {content}
                </p>
                {repliesState.includes(idx) ? (
                  <fetcher.Form
                    method="PUT"
                    className="flex justify-between gap-4 pl-[72px] mb-8"
                  >
                    <div className="flex-grow">
                      {" "}
                      <input
                        type="hidden"
                        name="suggestion_id"
                        value={suggestion.id}
                      />
                      <input
                        type="hidden"
                        name="parent_id"
                        value={parentId || id}
                      />
                      <input type="hidden" name="reply_to" value={username} />
                      <Input
                        extra={
                          <span className="text-body-md text-mainPink">{`@${username}`}</span>
                        }
                        disabled={isSubmitting}
                        name="comment"
                        type="text-area"
                      ></Input>
                    </div>

                    <Button
                      type="submit"
                      className="h-max "
                      variant={"primary"}
                      size={"sm"}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting" : "Post Reply"}
                    </Button>
                  </fetcher.Form>
                ) : null}
              </div>
            </div>
            {replies?.length ? (
              <div className=" ml-[72px] relative pt-8  ">
                <div className=" w-[2px] bg-mainBg absolute h-[95%] left-[-50px] top-[-33px] "></div>
                <Comments
                  comments={replies}
                  suggestion={suggestion}
                  parentId={id}
                />
              </div>
            ) : (
              <></>
            )}{" "}
            {!comment?.parent_id && comments.length !== idx + 1 ? (
              <div className="bg-mainBg h-[2px]"></div>
            ) : null}{" "}
          </div>
        );
      })}
    </>
  );
};

export default SuggestionDetail;
