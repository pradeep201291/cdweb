import { Injectable } from '@angular/core';

declare var gapi: any;
declare var google: any;
declare var window: any;

interface PickerData {
    clientId: string;
    appId: string;
    apiKey: string;
    locale: string;
    scope: string;
    origin: string;
}


@Injectable()
export class GooglePickerService {
    getPickerResponse(pickerData: PickerData, pickerCallBack: any) {
        let pickerApiLoaded = false;

        gapi.load('auth');
        gapi.load('picker');

        gapi.load('auth', {
            callback: function () {
                gapi.auth.authorize({
                    'client_id': pickerData.clientId,
                    'scope': pickerData.scope,
                    'immediate': false
                }, (authResult: any) => {
                    if (authResult && !authResult.error) {
                        let oauthToken = authResult.access_token;
                        if (pickerApiLoaded && oauthToken) {
                            let view = new google.picker.View(google.picker.ViewId.DOCS);
                            view.setMimeTypes(`image/png,image/jpeg,image/jpg,image/gif,text/plain,application/pdf,image/tiff,image/tif`);
                            let picker = new google.picker.PickerBuilder()
                                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                                .setAppId(pickerData.appId)
                                .setOAuthToken(oauthToken)
                                .addView(view)
                                .addView(new google.picker.DocsUploadView())
                                .setDeveloperKey(pickerData.apiKey)
                                .setCallback((data: any) => {
                                    if (data.action === google.picker.Action.PICKED) {
                                        pickerCallBack(null, data.docs[0], oauthToken);
                                    }
                                })
                                .setRelayUrl(window.location.href)
                                .build();

                            picker.setVisible(true);
                        }
                    } else {
                        pickerCallBack(authResult.error, null);
                    }
                });
            }
        });
        /**
         * @todo NEED TO CHECK THE PRESENCE OF PICKER. picker build visibility is set as  false
         */
        gapi.load('picker', {
            callback: function () {
                pickerApiLoaded = true;
                if (pickerApiLoaded) {
                    let view = new google.picker.View(google.picker.ViewId.DOCS);
                    view.setMimeTypes(`image/png,image/jpeg,image/jpg,image/gif,text/plain,application/pdf,image/tiff,image/tif`);
                    let picker = new google.picker.PickerBuilder()
                        .enableFeature(google.picker.Feature.NAV_HIDDEN)
                        .setAppId(pickerData.appId)
                        .addView(view)
                        .addView(new google.picker.DocsUploadView())
                        .setDeveloperKey(pickerData.apiKey)
                        .setCallback((data: any) => {
                            if (data.action === google.picker.Action.PICKED) {
                                // var fileId = data.docs[0].id;
                                // alert('The user selected: ' + fileId);
                                pickerCallBack(null, data.docs);
                            }
                        })
                        .setRelayUrl(window.location.href)
                        .build();
                    /* if (pickerData.multiselect) {
                         picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
                     }*/
                    picker.setVisible(false);
                }
            }
        });
    }
}
