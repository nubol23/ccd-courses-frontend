import {strict} from "assert";
import {stringify} from "querystring";

export class Section {
  arrayIdx: number;
  uid: string = '';
  courseId: string;
  sectionName: string;
  videoId: string = '';
  liveUrl: string;
  sectionExplanation: string;
  programmingAssignmentUrl: string;
  creationDate: Date;
  colabAssignmentUrl: string;
  testCases: string;
  evaluable: boolean;

  constructor(courseId: string, sectionName: string, videoId: string, liveUrl: string,
              creationDate?: Date, sectionExplanation?: string, programmingAssignmentUrl?: string, uid?: string) {
    this.courseId = courseId;
    this.sectionName = sectionName;
    this.videoId = videoId;
    this.liveUrl = liveUrl;

    if (sectionExplanation)
      this.sectionExplanation = sectionExplanation;
    else
      this.sectionExplanation = '';

    if (programmingAssignmentUrl)
      this.programmingAssignmentUrl = programmingAssignmentUrl;
    else
      this.programmingAssignmentUrl = '';

    if (creationDate) {
      this.creationDate = creationDate;
    }
    else {
      // Create date in UTC
      this.creationDate = new Date();
      this.creationDate.setTime(this.creationDate.getTime() + this.creationDate.getTimezoneOffset() * 60 * 1000);
    }

    // Only for this case.
    if (uid)
      this.uid = uid;
    else
      this.uid = '';

    this.arrayIdx = 0;
  }
}
