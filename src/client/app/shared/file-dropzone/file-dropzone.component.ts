import { Component, AfterViewInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';

declare var Dropzone: any;

@Component({
    selector: 'sl-file-drop',
    templateUrl: './file-dropzone.component.html'
})
export class FileDropZoneComponent implements AfterViewInit, OnDestroy {
    @Input() isMultipleFileUpload: boolean;
    @Output() fileSelectionHandler: EventEmitter<File> = new EventEmitter<File>();
    @Output() uploadFileEventHandler = new EventEmitter();

    private dropzone: any;

    /**
     * 
     * 
     * 
     * @memberOf FileDropZoneComponent
     */
    ngAfterViewInit() {
        this.createDropZone();
        this.getSelectedFile();
    }

    /**
     * 
     * 
     * 
     * @memberOf FileDropZoneComponent
     */
    createDropZone() {
        let self = this;
        this.dropzone = new Dropzone('div#filedrop', {
            url: self.urlCallBack,
            autoProcessQueue: false,
            uploadMultiple: this.isMultipleFileUpload,
            parallelUploads: 20,
            dictDefaultMessage: '',
            maxFiles: 20,
            acceptedFiles: 'image/*,text/plain,application/pdf',
            clickable: false,
            previewsContainer: false,
            previewTemplate: false
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf FileDropZoneComponent
     */
    getSelectedFile() {
        this.dropzone.on('addedfile', (file: any) => {
            this.fileSelectionHandler.emit(file);
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf FileDropZoneComponent
     */
    uploadFileHandler() {
        this.uploadFileEventHandler.emit();
    }

    /**
     * 
     * 
     * @param {any[]} files
     * 
     * @memberOf FileDropZoneComponent
     */
    urlCallBack(files: any[]) {
    }

    /**
     * 
     * 
     * 
     * @memberOf FileDropZoneComponent
     */
    ngOnDestroy() {
        this.dropzone.disable();
    }
}
