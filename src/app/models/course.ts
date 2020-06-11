export class Course {
  public id: string;
  public title: string;
  public description: string;
  public coverUrl: string;

  constructor(title: string, description: string, coverUrl: string) {
    this.title = title;
    this.description = description;
    this.coverUrl = coverUrl;
  }
}
