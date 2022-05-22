export class Position{
    name: string;
    col: number;
    row: number;
    colspan: number;
  static positions: Position[] = [
    {'name': 'top_bar','col':0, 'row':0, 'colspan':3},
    {'name':'top_left', 'col':0, 'row':1, 'colspan':1},
    {'name':'top_center', 'col':1, 'row':1, 'colspan':1},
    {'name':'top_right', 'col':2, 'row':1, 'colspan':1},
    {'name':'upper_third', 'col':0, 'row':2, 'colspan':3},
    {'name':'middle_center', 'col':0, 'row':3, 'colspan':3},
    {'name':'lower_third', 'col':0, 'row':4, 'colspan':3},
    {'name':'bottom_left', 'col':0, 'row':5, 'colspan':1},
    {'name':'bottom_center', 'col': 1, 'row':5, 'colspan':1},
    {'name':'bottom_right', 'col':2, 'row': 5, 'colspan':1},
    {'name':'bottom_bar', 'col':0, 'row': 6, 'colspan':3}
    ];
}