export const INIT_DATA = 'INIT_DATA';
export const UPDATE_DATA = 'UPDATE_DATA';

class initAction {
  public type = INIT_DATA;
  constructor() {}
}


export class StoreActions {
  static init() {
    return new initAction();
  }
}