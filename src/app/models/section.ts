import {strict} from "assert";
import {stringify} from "querystring";

export class Section {
  uid: string = '';
  courseId: string;
  sectionName: string;
  videoId: string = '';
  liveUrl: string;
  sectionExplanation: string;
  programmingAssignmentUrl: string;

  constructor(courseId: string, sectionName: string, videoId: string, liveUrl: string) {
    this.courseId = courseId;
    this.sectionName = sectionName;
    this.videoId = videoId;
    this.liveUrl = liveUrl;

    this.sectionExplanation = '';
    this.programmingAssignmentUrl = '';
  }
}
