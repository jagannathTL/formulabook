import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewDataService } from '../../../providers/new-data-service'
import { symbolValidator, createMeasureValidator } from '../validators/custom.validators'
import { Formula, Variable, Global, FormulaRun, ValueU } from '../../../reducers/resource'
import { combineAll } from 'rxjs/observable/combineAll';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'fl-val',
	templateUrl: 'val.html',
})

export class ValComponent{
	constructor(nds: NewDataService) {

	}
	@Input() resource;
	@Input() editMode:boolean = false;
	

	ngOnInit() {
		
	}

}

//Global variable used in formula
@Component({
	selector: 'fl-run',
	templateUrl: 'run.html',
})
export class RunComponent{
	form:FormGroup;
    editModein:boolean = false;
	valueChange$:Observable<any>;
	constructor(nds: NewDataService) {

	}
	@Input() resource:FormulaRun;
	@Input() formula:Formula;
	ngOnInit() {
			let r = this.resource;
			this.form = new FormGroup({
				name: new FormControl(r.name, [ Validators.minLength(2)
											, Validators.maxLength(30)]),
                value: new FormControl(r.result)
            })
            let keys = Object.keys(r.values);
			let vals$:Observable<any>[] = [];
			keys.forEach((k,i) => {
				let fc = new FormControl(r.values[k], [Validators.required]) as FormControl;
				this.form.addControl("Var"+i, fc );
				vals$.push(fc.valueChanges);
            })
			this.valueChange$ = Observable.from(vals$)
			.map(i => i)
			.combineAll(r => {
				this.nnds.evaluateFormula(this.formula, this.resource);
			})

			

	}

    getKeys(){
        return Object.keys(this.resource.values)
    }

    onPress(evt) {
	// 	let runRow = evt.target;
    console.log('Long press row')
         this.editModein = !this.editModein;
    }

	evaluate(){
		this.nds.evaluate(this.resource);
        }, 600);
	}

	getVariables():Variable[]{
		let r = this.resource as Varval;
		return r._formula._variables;
	}

	getFormatedValues(){
		return this.resource.variables;
}
    
}