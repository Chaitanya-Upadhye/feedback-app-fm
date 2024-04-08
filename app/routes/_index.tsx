import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export interface Comment {
  id: number;
  content: string;
  user: {
    image: string;
    name: string;
    username: string;
  };
  replies: Reply[];
}
export interface Reply extends Comment {
  replyingTo: string;
}
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const comments = [
    {
      id: 3,
      content:
        "Also, please allow styles to be applied based on system preferences. I would love to be able to browse Frontend Mentor in the evening after my device’s dark mode turns on without the bright background it currently has.",
      user: {
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Elijah Moss",
        username: "hexagon.bestagon",
      },
    },
    {
      id: 4,
      content:
        "Second this! I do a lot of late night coding and reading. Adding a dark theme can be great for preventing eye strain and the headaches that result. It’s also quite a trend with modern apps and  apparently saves battery life.",
      user: {
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "James Skinner",
        username: "hummingbird1",
      },
      replies: [
        {
          content:
            "While waiting for dark mode, there are browser extensions that will also do the job. Search for 'dark theme' followed by your browser. There might be a need to turn off the extension for sites with naturally black backgrounds though.",
          replyingTo: "hummingbird1",
          user: {
            image:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Anne Valentine",
            username: "annev1990",
          },
        },
        {
          content:
            "Good point! Using any kind of style extension is great and can be highly customizable, like the ability to change contrast and brightness. I'd prefer not to use one of such extensions, however, for security and privacy reasons.",
          replyingTo: "annev1990",
          user: {
            image:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Ryan Welles",
            username: "voyager.344",
          },
        },
      ],
    },
  ];

  return json({ comments });
};

export default function Index() {
  const { comments } = useLoaderData<{ comments: Comment[] }>();
  return (
    <div className="m-6 p-6 bg-slate-50 border border-slate-300 rounded-md ">
      <Comments comments={comments} />
    </div>
  );
}
const Comments = ({ comments }: { comments: Comment[] }) => {
  return (
    <>
      {" "}
      {comments.map((comment) => {
        const {
          content,
          user: { name, username, image },
          id,
          replies,
        } = comment;
        return (
          <>
            <div className="  p-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <img
                    src={image}
                    alt="user-avatar"
                    className="rounded-full h-10 w-10"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{name}</span>
                    <span className="font-thin text-sm">{`@${username}`}</span>
                  </div>
                </div>

                <span className="text-blue font-semibold">Reply</span>
              </div>
              <p className="font-normal text-slate-700 py-4 pl-14">{content}</p>
            </div>
            {replies?.length ? (
              <div className="border-l border-l-slate-200 ml-8  ">
                <Comments comments={replies} />
              </div>
            ) : (
              <div className="border border-slate-200 h-[1px]"></div>
            )}
          </>
        );
      })}
    </>
  );
};
