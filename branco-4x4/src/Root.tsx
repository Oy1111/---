import { Composition } from "remotion";
import { Lab } from "./Lab";
import { BrancoVideo, DURATION } from "./Video";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Branco" component={BrancoVideo} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
    <Composition id="Lab" component={Lab} durationInFrames={300} fps={30} width={1080} height={1920} />
  </>
);
