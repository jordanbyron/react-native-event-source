//
//  RNEventSource.h
//  RNEventSource
//
//  Created by Jordan Byron on 6/10/15.
//  Copyright © 2015 Jordan Byron. All rights reserved.
//

#import "RCTBridgeModule.h"
#import "EventSource.h"

@interface RNEventSource : NSObject <RCTBridgeModule> {
    EventSource *eventSource;
}

@property (nonatomic, retain) EventSource *eventSource;
@end