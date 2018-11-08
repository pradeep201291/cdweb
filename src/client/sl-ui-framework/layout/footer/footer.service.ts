import { Injectable } from '@angular/core';
import { StearnsHttpClient } from '../../infrastructure/http-client/http-client.service';
import { EulaConfig } from './footer.model';
import { Observable } from 'rxjs/observable';
@Injectable()
export class FooterService {
    private eulaConfigUrl = '@SL_APP_ROOT_PATH@assets/config/eula.json';

    constructor(private http: StearnsHttpClient) {

    }

    getEulaDetails(companyCode: string): Observable<EulaConfig> {
        return this.http.get(this.eulaConfigUrl)
            .map(res => {
                let result = <EulaConfig[]>res.json();
                return result.find(e => e.companyCode === companyCode);
            });
    }
}
