module BillForward {
  export class ProductRatePlan extends MutableEntity {
    protected static _resourcePath = new ResourcePath('product-rate-plans', 'productRatePlan');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.registerEntityArray('taxation', TaxationLink);
        this.registerEntityArray('pricingComponents', PricingComponent);
        
        this.registerEntity('product', Product);
        this.unserialize(stateParams);
    }

    getProduct() {
        return <Q.Promise<Product>>Imports.Q.Promise((resolve, reject) => {
            try {
                var promise;
                if ((<any>this).product) {
                    promise = Imports.Q.when((<any>this).product);
                } else {
                    if (!(<any>this).productID) {
                        throw new BFPreconditionFailedError("This ProductRatePlan has neither a 'product' specified, nor a 'productID' by which to obtain said product.");
                    }
                    promise = Product.getByID((<any>this).productID)
                    .then((product) => {
                        (<any>this).product = product;
                        return (<any>this).product;
                        });
                }
                return resolve(promise);
            } catch(e) {
                return reject(e);
            }
        });
    }

    static getForProduct(product:EntityReference, queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Array<ProductRatePlan>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var productIdentifier = Product.getIdentifier(product);

                var endpoint = Imports.util.format("product/%s", encodeURIComponent(productIdentifier));

                var myClass = this.getDerivedClassStatic();
                return resolve(
                    myClass.getAndGrabCollection(endpoint, queryParams, client)
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }
  }
}