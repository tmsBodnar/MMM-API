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
    {'name': 'top_bar','col':0, 'row':0, 'colspan':3, 'rowspan':1, background: '#b0bec5'},
    {'name':'top_left', 'col':0, 'row':1, 'colspan':1, 'rowspan':1, background: '#ffb2dd'},
    {'name':'top_center', 'col':1, 'row':1, 'colspan':1, 'rowspan':1, background: '#ff80ab'},
    {'name':'top_right', 'col':2, 'row':1, 'colspan':1, 'rowspan':1, background: '#c94f7c'},
    {'name':'upper_third', 'col':0, 'row':2, 'colspan':3, 'rowspan':1, background: '#76ffff'},
    {'name':'middle_center', 'col':0, 'row':3, 'colspan':3, 'rowspan':1, background: '#18ffff'},
    {'name':'lower_third', 'col':0, 'row':4, 'colspan':3, 'rowspan':1, background: '#00cbcc'},
    {'name':'bottom_left', 'col':0, 'row':5, 'colspan':1, 'rowspan':1, background: '#ffd0b0'},
    {'name':'bottom_center', 'col': 1, 'row':5, 'colspan':1, 'rowspan':1, background: '#ff9e80'},
    {'name':'bottom_right', 'col':2, 'row': 5, 'colspan':1, 'rowspan':1, background: '#c96f53'},
    {'name':'bottom_bar', 'col':0, 'row': 6, 'colspan':3, 'rowspan':1, background: '#b0bec5'}
    ];
}