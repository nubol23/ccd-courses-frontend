export class Assignment {
  preCell: string;
  sampleCell: string;
  solutionCell: string;
  testCell: string;
  hintCell: string;

  constructor(preCell: string, sampleCell: string, solutionCell: string, testCell: string, hintCell: string) {
    this.preCell = preCell;
    this.sampleCell = sampleCell;
    this.solutionCell = solutionCell;
    this.testCell = testCell;
    this.hintCell = hintCell;
  }
}

export class AssignmentFile {
  public file: File;
  public filename:  string;
  public url: string;
  public uploading: boolean;
  public progress: number;

  constructor(file: File, filename?: string) {
    this.file = file;
    if (filename)
      this.filename = filename;
    else
      this.filename = file.name;

    this.uploading = false;
    this.progress = 0;
  }

}
