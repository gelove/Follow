import { browserDB } from "@renderer/database"
import type { FeedModel } from "@renderer/models/types"

import { BaseService } from "./base"
import { CleanerService } from "./cleaner"

type FeedModelWithId = FeedModel & { id: string }
class ServiceStatic extends BaseService<FeedModelWithId> {
  constructor() {
    super(browserDB.feeds)
  }

  override async upsertMany(data: FeedModel[]) {
    const filterData = data.filter((d) => d.id)
    CleanerService.reset(filterData.map((d) => ({ type: "feed", id: d.id! })))

    return this.table.bulkPut(filterData as FeedModelWithId[])
  }

  override async upsert(data: FeedModel): Promise<string | null> {
    if (!data.id) return null
    CleanerService.reset([{ type: "feed", id: data.id }])
    return this.table.put(data as FeedModelWithId)
  }

  async bulkDelete(ids: string[]) {
    return this.table.bulkDelete(ids)
  }
}

export const FeedService = new ServiceStatic()
