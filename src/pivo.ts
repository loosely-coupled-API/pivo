import { ActionSemantics, DataSemantics } from './domain'
import SemanticOpenApiDoc from './open-api/semantic-open-api-documentation'
import ApiOperation from './api-operation'
import HttpClient from './http-client'
import { OpenAPIV3 } from 'openapi-types'
import Option from './utils/option'
import { ExpandedOpenAPIV3Semantics } from './open-api/open-api-types'

export default class Pivo {
  private httpClient: HttpClient
  private documentation: SemanticOpenApiDoc

  public constructor (documentation: OpenAPIV3.Document) {
    this.documentation = new SemanticOpenApiDoc(documentation)
    this.httpClient = new HttpClient(this.documentation)
  }

  public does (action: ActionSemantics): Option<ApiOperation> {
    return this.documentation
      .findOperation(action)
      .map(operation => new ApiOperation(operation, this.httpClient))
  }

  public get (data: DataSemantics): Option<ApiOperation> {
    return this.documentation
      .findOperationThatReturns(data)
      .map(operation => new ApiOperation(operation, this.httpClient))
  }

  public list (data: DataSemantics): Option<ApiOperation> {
    return this.documentation
      .findOperationListing(data)
      .map(operation => new ApiOperation(operation, this.httpClient))
  }

  public fromUrl (url: string): Option<ApiOperation> {
    return this.documentation
      .findGetOperationWithPathMatching(url)
      .map(operation => new ApiOperation(operation, this.httpClient))
  }

  public fromOperation (
    operation: ExpandedOpenAPIV3Semantics.OperationObject
  ): ApiOperation {
    return new ApiOperation(operation, this.httpClient)
  }

  /*
  fromId(id) {
    const operation = this.apiDocumentation.findGetOperationWithPathMatching(id)

    return {
      operation: new GenericOperation(operation, this.apiDocumentation, this.httpCaller),
      parameters: extractPathParameters(id, operation.url) // TODO: remake this possible
    }
  }
  */
}
