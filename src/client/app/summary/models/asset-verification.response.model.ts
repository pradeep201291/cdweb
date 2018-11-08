export interface FormWidgetData {
    GetEnrollmentWidgetResult: boolean;
    widget: string;
    errorMessage: string;
}

export interface GetFormWidgetResponse {
    Body: FormWidgetData;
}
