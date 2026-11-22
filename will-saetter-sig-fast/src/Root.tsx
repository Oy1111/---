import { Composition } from "remotion";
import { Lab } from "./Lab";
import { WillVideo, DURATION } from "./Video";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Will" component={WillVideo} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
    <Composition id="Lab" component={Lab} durationInFrames={3} fps={30} width={1080} height={1920} />
  </>
);
