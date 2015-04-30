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
                var ref:EntityReference;
                // could use ID
                if ((<any>this).productID)
                ref = (<any>this).productID;
                // prefer product entity if present
                if ((<any>this).product)
                ref = (<any>this).product;

                return resolve(Product.fetchIfNecessary(ref)
                    .then((product) => {
                        // cache because why not
                        (<any>this).product = product;
                        return (<any>this).product;
                        })
                    );
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