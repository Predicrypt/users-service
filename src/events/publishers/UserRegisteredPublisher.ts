import {
  KeysUpdatedEventInterface,
  PublisherAbstract,
  SubjectEnum,
  UserRegisteredEventInterface,
} from '@Predicrypt/common';

export class KeysUpdatedPublisher extends PublisherAbstract<KeysUpdatedEventInterface> {
  subject: SubjectEnum.KeysUpdated = SubjectEnum.KeysUpdated;
}
