import { ValidationError } from "class-validator";



export class Utils {

    public extractValidationErrors(errors: ValidationError[]): { property: string, constraints: any }[] {
        return errors.flatMap(error => this.flattenValidationError(error));
      }
    
      private flattenValidationError(error: ValidationError): { property: string, constraints: any }[] {
        const result: { property: string, constraints: any }[] = [];
        for (const property in error.constraints) {
          if (error.constraints.hasOwnProperty(property)) {
            result.push({ property, constraints: error.constraints[property] });
          }
        }
        if (error.children && error.children.length > 0) {
          for (const childError of error.children) {
            result.push(...this.flattenValidationError(childError));
          }
        }
        return result;
      }

}

 