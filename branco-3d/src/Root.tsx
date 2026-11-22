import { Composition } from "remotion";
import { BrancoVideo, DURATION } from "./Video";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Branco" component={BrancoVideo} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
  </>
);
