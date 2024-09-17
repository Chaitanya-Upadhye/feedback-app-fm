import ResponsiveBlock, {
  Desktop,
  Mobile,
  Tablet,
} from "~/components/ResponsiveBlock";
function Suggestions() {
  return (
    <ResponsiveBlock>
      <div>This is shared</div>
      <Mobile>
        <div>I am only visible on mobile.</div>
      </Mobile>
      <Tablet>
        <div>I am only visible on medium size devices.</div>
      </Tablet>
      <Desktop>
        <div>I am only visible on Larger screens.</div>
      </Desktop>
    </ResponsiveBlock>
  );
}

export default Suggestions;
