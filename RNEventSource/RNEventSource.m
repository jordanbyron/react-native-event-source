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
#import "EventSource.h"

#import "RNEventSource.h"

@implementation RNEventSource

@synthesize eventSource;
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (void)dealloc{
    [self.eventSource close];
}

RCT_EXPORT_METHOD(connectWithURL:(NSString *)URLString){
    NSURL *serverURL = [NSURL URLWithString:URLString];
    
    self.eventSource = [EventSource eventSourceWithURL:serverURL];
    
    [self.eventSource onOpen: ^(Event *e) {
        RCTLogInfo(@"EventSource: Connected");
        
        [self.bridge.eventDispatcher sendDeviceEventWithName:@"EventSourceConnected"
                                                        body:@{@"event": @"connected",
                                                               // Guard against null values as NSMutableDictionary
                                                               // expects objects
                                                               @"data": e.data ? e.data : [NSNull null]}];
    }];
    
    [self.eventSource onError: ^(Event *e) {
        RCTLogInfo(@"EventSource: Error %@: %@", e.event, e.data);
        
        [self.bridge.eventDispatcher sendDeviceEventWithName:@"EventSourceError"
                                                        body:@{@"event": @"error",
                                                               // Guard against null values as NSMutableDictionary
                                                               // expects objects
                                                               @"data": e.data ? e.data : [NSNull null]}];
    }];
    
    [self.eventSource onMessage: ^(Event *e) {
        RCTLogInfo(@"%@: %@", e.event, e.data);
        
        [self.bridge.eventDispatcher sendDeviceEventWithName:@"EventSourceMessage"
                                                        body:@{@"event": e.event ? e.event : [NSNull null],
                                                               @"data": e.data ? e.data : [NSNull null]}];
    }];
    
}

RCT_EXPORT_METHOD(close){
    [self.eventSource close];
    RCTLogInfo(@"EventSource: Closed");
}

@end