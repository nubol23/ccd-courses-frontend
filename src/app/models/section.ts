import {strict} from "assert";
import {stringify} from "querystring";

export class Section {
  courseName: string;
  sectionName: string;
  videoId: string = '';
  liveUrl: string;
  sectionExplanation: string;
  programmingAssignmentsUrl: string;

  constructor(courseName: string, sectionName: string, videoId: string, liveUrl: string) {
    this.courseName = courseName;
    this.sectionName = sectionName;
    this.videoId = videoId;
    this.liveUrl = liveUrl;

    this.sectionExplanation = '';
    this.programmingAssignmentsUrl = '';
  }
}
