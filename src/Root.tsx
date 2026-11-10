import React from "react";
import {Composition} from "remotion";
import {RajaDzholim} from "./RajaDzholim";
export const Root: React.FC = () => <Composition id="RajaDzholim" component={RajaDzholim} durationInFrames={3600} fps={30} width={1920} height={1080}/>;
