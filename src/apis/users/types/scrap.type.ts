import { CompetitionType } from '../../crawling/types/competition.type';
import { InternType } from '../../crawling/types/intern.type';
import { LanguageType } from '../../crawling/types/language.type';
import { OutsideType } from '../../crawling/types/outside.type';
import { QnetType } from '../../crawling/types/qnet.type';

export interface ScrapType
    extends QnetType,
        CompetitionType,
        InternType,
        LanguageType,
        OutsideType {}
