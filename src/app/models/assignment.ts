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
