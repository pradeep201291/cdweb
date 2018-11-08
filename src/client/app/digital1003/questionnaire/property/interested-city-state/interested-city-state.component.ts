import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PropertyQuestionaire } from './../../../rules/models/property-questionaire.typedef';
import { QuestionaireComponent } from './../../../rules/models/questionaire-abstract/questionaire-component';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'sl-interested-city-state',
    templateUrl: './interested-city-state.component.html',
})

export class InterestedCityState extends QuestionaireComponent<PropertyQuestionaire> implements OnInit {
    @Input() input: PropertyQuestionaire;
    @Output() output: EventEmitter<PropertyQuestionaire>;
    /**
         * loanOptionForm
         * 
         * @type {FormGroup}
         * @memberOf LoanOptionComponent
         */
    cityStateForm: FormGroup;
    btnClick: boolean;
    states: string[];
    selectedStateValue: string;
    isStateSelected: boolean;

    /**
     * Creates an instance of LoanOptionComponent.
     * 
     * @param {FormBuilder} fb
     * 
     * @memberOf LoanOptionComponent
     */
    constructor(private fb: FormBuilder, private _eref: ElementRef) { super(); }

    ngOnInit() {
        // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        // Add 'implements OnInit' to the class.
        this.cityStateForm = this.fb.group(
            {
                city: ['', [Validators.required]],
                state: ['', []]
            });
        this.btnClick = false;
        this.isStateSelected = false;
        this.states = ['CA', 'GS', 'MI'];

    }
    onClick(event: any) {
        this.btnClick = false;
    }

    buttonClick(event: any): void {
        this.btnClick = !this.btnClick;
        if (event) {
            event.stopPropagation();
        }

    }
    selectedState(selectedState: string) {
        this.isStateSelected = true;
        this.selectedStateValue = selectedState;
        this.btnClick = false;
        console.log('selected state is : ' + selectedState);
    }
}
