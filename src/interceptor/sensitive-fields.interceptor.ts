import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveSensitiveFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.removeSensitiveFields(data);
      }),
    );
  }

  // function for removing sensitive fields
  private removeSensitiveFields(data: any): any {
    if (!data) return data;

    // if data is an array, process each item
    if (Array.isArray(data)) {
      return data.map((item) => this.removeSensitiveFields(item));
    }

    // if data is an object
    if (typeof data === 'object') {
      // do not directly modify the object, make a copy
      const result = { ...data };

      // remove sensitive fields
      delete result.__v;
      delete result.refreshToken;
      delete result.password;

      // if the object has a toObject method (Mongoose document)
      if (data.toObject && typeof data.toObject === 'function') {
        const plainObject = data.toObject();
        delete plainObject.__v;
        delete plainObject.refreshToken;
        delete plainObject.password;

        // convert _id to string
        if (plainObject._id) {
          // it can be a Buffer
          if (Buffer.isBuffer(plainObject._id)) {
            plainObject._id = plainObject._id.toString('hex');
          }
          // it can be an ObjectId
          else if (typeof plainObject._id.toString === 'function') {
            plainObject._id = plainObject._id.toString();
          }
        }

        return plainObject;
      }

      // convert _id to string (for normal objects)
      if (result._id) {
        // it can be a Buffer
        if (Buffer.isBuffer(result._id)) {
          result._id = result._id.toString('hex');
        }
        // it can be an ObjectId
        else if (typeof result._id.toString === 'function') {
          result._id = result._id.toString();
        }
      }

      // clean other objects in the object
      for (const key in result) {
        if (result[key] && typeof result[key] === 'object') {
          result[key] = this.removeSensitiveFields(result[key]);
        }
      }

      return result;
    }

    return data;
  }
}
