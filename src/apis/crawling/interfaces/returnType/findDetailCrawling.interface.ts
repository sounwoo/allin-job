import { CompetitionType } from '../../types/competition.type';
import { InternType } from '../../types/intern.type';
import { LanguageType } from '../../types/language.type';
import { OutsideType } from '../../types/outside.type';
import { QnetType } from '../../types/qnet.type';

export type findeDetailCrawling =
    | OutsideType
    | CompetitionType
    | InternType
    | QnetType
    | LanguageType;
