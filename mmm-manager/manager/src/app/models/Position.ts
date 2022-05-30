import {Module} from "../models/Module";

export class Position{
    name: string;
    col: number;
    row: number;
    colspan: number;
    rowspan: number;
    background: string;
    modules?: Module[];
  static positions: Position[] = [
    {'name': 'top_bar','col':0, 'row':0, 'colspan':3, 'rowspan':1, background: '#30444e'},
    {'name':'top_left', 'col':0, 'row':1, 'colspan':1, 'rowspan':1, background: '#ff1744'},
    {'name':'top_center', 'col':1, 'row':1, 'colspan':1, 'rowspan':1, background: '#ff80ab'},
    {'name':'top_right', 'col':2, 'row':1, 'colspan':1, 'rowspan':1, background: '#e040fb'},
    {'name':'upper_third', 'col':0, 'row':2, 'colspan':3, 'rowspan':1, background: '#448aff'},
    {'name':'middle_center', 'col':0, 'row':3, 'colspan':3, 'rowspan':1, background: '#69f0ae'},
    {'name':'lower_third', 'col':0, 'row':4, 'colspan':3, 'rowspan':1, background: '#ffff00'},
    {'name':'bottom_left', 'col':0, 'row':5, 'colspan':1, 'rowspan':1, background: '#ffab40'},
    {'name':'bottom_center', 'col': 1, 'row':5, 'colspan':1, 'rowspan':1, background: '#ff6f00'},
    {'name':'bottom_right', 'col':2, 'row': 5, 'colspan':1, 'rowspan':1, background: '#ff5722'},
    {'name':'bottom_bar', 'col':0, 'row': 6, 'colspan':3, 'rowspan':1, background: '#b0bec5'}
    ];
}