//
//  RNEventSource.m
//  RNEventSource
//
//  Created by Jordan Byron on 6/10/15.
//  Copyright © 2015 Jordan Byron. All rights reserved.
//

#import "RCTBridge.h"
#import "RCTConvert.h"
#import "RCTEventDispatcher.h"
#import "RCTUtils.h"
#import "EventSource.h"

#import "RNEventSource.h"

@implementation RNEventSource

@synthesize eventSource;
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (void)invalidate
{
    [self.eventSource close];
    self.eventSource = nil;
}

- (void)dealloc{
    [self invalidate];
}

RCT_EXPORT_METHOD(connectWithURL:(NSString *)URLString){
    NSURL *serverURL = [NSURL URLWithString:URLString];

    self.eventSource = [EventSource eventSourceWithURL:serverURL];

    [self.eventSource onOpen: ^(Event *e) {
        RCTLogInfo(@"RNEventSource: onOpen");

        [self.bridge.eventDispatcher sendDeviceEventWithName:@"EventSourceConnected"
                                                        body:@{@"event": @"connected",
                                                               @"data": [NSNull null]}];
    }];

    [self.eventSource onError: ^(Event *e) {
        RCTLogInfo(@"RNEventSource: onError (%@)", e.error);

        [self.bridge.eventDispatcher sendDeviceEventWithName:@"EventSourceError"
                                                        body:@{
                                                          @"domain": RCTNullIfNil(e.error.domain),
                                                          @"code": [NSNumber numberWithInteger:e.error.code],
                                                          @"description": e.error.userInfo[@"NSLocalizedDescription"]
                                                        }];
        [self close];
    }];

    [self.eventSource onMessage: ^(Event *e) {
        RCTLogInfo(@"RNEventSource: onMessage (%@: %@)", e.event, e.data);

        [self.bridge.eventDispatcher sendDeviceEventWithName:@"EventSourceMessage"
                                                        body:@{@"event": RCTNullIfNil(e.event),
                                                               @"data": RCTNullIfNil(e.data)}];
    }];

}

RCT_EXPORT_METHOD(close){
    [self.eventSource close];
    RCTLogInfo(@"RNEventSource: Closed");
}

@end
