import {Injectable} from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
// import { Http, Response } from '@angular/http';
// import { Observable } from 'rxjs/Observable';

@Injectable()
export class StaticResourceService {

    constructor(private _http: Http) {

    }
}
