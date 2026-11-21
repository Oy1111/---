import { Composition } from "remotion";
import { PullUpVideo, DURATION } from "./PullUp";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition id="PullUp" component={PullUpVideo} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
  );
};
