import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Asset, Order, OrderLine, ProductVariant } from '../../../entity';
import { AssetService, OrderService, ProductVariantService } from '../../../service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('OrderLine')
export class OrderLineEntityResolver {
    constructor(
        private productVariantService: ProductVariantService,
        private assetService: AssetService,
        private orderService: OrderService,
    ) {}

    @ResolveField()
    async productVariant(
        @Ctx() ctx: RequestContext,
        @Parent() orderLine: OrderLine,
    ): Promise<ProductVariant> {
        if (orderLine.productVariant) {
            return orderLine.productVariant;
        }
        return this.productVariantService.getVariantByOrderLineId(ctx, orderLine.id);
    }

    @ResolveField()
    async featuredAsset(
        @Ctx() ctx: RequestContext,
        @Parent() orderLine: OrderLine,
    ): Promise<Asset | undefined> {
        if (orderLine.featuredAsset) {
            return orderLine.featuredAsset;
        } else {
            return this.assetService.getFeaturedAsset(ctx, orderLine);
        }
    }

    @ResolveField()
    async order(@Ctx() ctx: RequestContext, @Parent() orderLine: OrderLine): Promise<Order | undefined> {
        return this.orderService.findOneByOrderLineId(ctx, orderLine.id);
    }
}
