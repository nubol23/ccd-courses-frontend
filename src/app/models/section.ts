import {strict} from "assert";
import {stringify} from "querystring";

export class Section {
  sectionName: string;
  videoId: string = '';
  liveUrl: string;
  sectionExplanation: string;
  programmingAssignmentsUrl: string;

  constructor(sectionName: string, videoId: string, liveUrl: string) {
    this.sectionName = sectionName;
    this.videoId = videoId;
    this.liveUrl = liveUrl;

    this.sectionExplanation = '';
    this.programmingAssignmentsUrl = '';
  }
}
