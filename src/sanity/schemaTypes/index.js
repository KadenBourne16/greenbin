import {resident} from '../schema/resident'
import {bin} from '../schema/bin'
import {collectorRoute} from '../schema/collectorRoute'
import {wasteRequest} from '../schema/wasteRequest'
import {feedback} from '../schema/feedback'
import {wasteCollector} from '../schema/wasteCollector'

export const schema = {
  types: [
    resident,
    bin,
    collectorRoute,
    wasteRequest,
    feedback,
    wasteCollector
  ],
}